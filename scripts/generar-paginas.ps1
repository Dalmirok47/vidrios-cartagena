# Genera una página por producto (p/<REF>.html) con las etiquetas que leen WhatsApp, Facebook, etc.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\generar-paginas.ps1 -Sitio "https://USUARIO.github.io/vidrios-cartagena"
param([string]$Sitio)

$raiz = Split-Path -Parent $PSScriptRoot
$archivoSitio = Join-Path $PSScriptRoot "sitio.txt"

if ($Sitio) {
  Set-Content -Path $archivoSitio -Value $Sitio.Trim().TrimEnd('/') -Encoding ascii
} elseif (Test-Path $archivoSitio) {
  $Sitio = (Get-Content $archivoSitio -Raw).Trim()
} else {
  Write-Host "Indica la URL publicada con -Sitio ""https://USUARIO.github.io/vidrios-cartagena""" -ForegroundColor Yellow
  exit 1
}
$Sitio = $Sitio.TrimEnd('/')

function EscHtml($t) { [System.Net.WebUtility]::HtmlEncode([string]$t) }

$productos = Get-Content (Join-Path $raiz "assets/data/productos.json") -Raw -Encoding utf8 | ConvertFrom-Json

$carpeta = Join-Path $raiz "p"
New-Item -ItemType Directory -Path $carpeta -Force | Out-Null
Get-ChildItem $carpeta -Filter *.html -ErrorAction SilentlyContinue | Remove-Item -Force

$sinBom = New-Object System.Text.UTF8Encoding($false)

foreach ($p in $productos) {
  # Imagen: la primera foto real del producto; si no hay, la tarjeta con el logo
  $foto = $p.imagenes | Where-Object { $_.src } | Select-Object -First 1
  $imagen = if ($foto) { "$Sitio/" + $foto.src.TrimStart('/') } else { "$Sitio/assets/img/og-default.jpg" }

  $partes = @($p.material)
  if ($p.medidas) { $partes += "Medidas: $($p.medidas.ancho) x $($p.medidas.alto)" }
  $partes += "Ref. $($p.id)"
  $descripcion = $partes -join " · "

  $titulo = "$($p.nombre) | Vidrios Cartagena"
  $urlPagina = "$Sitio/p/$($p.id).html"
  $destino = "../producto.html?id=$($p.id)"

  $html = @"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$(EscHtml $titulo)</title>
  <meta name="description" content="$(EscHtml $descripcion)">
  <link rel="canonical" href="$(EscHtml $urlPagina)">
  <link rel="icon" type="image/png" href="../assets/img/logo/favicon.png">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Vidrios Cartagena">
  <meta property="og:locale" content="es_CO">
  <meta property="og:title" content="$(EscHtml $titulo)">
  <meta property="og:description" content="$(EscHtml $descripcion)">
  <meta property="og:url" content="$(EscHtml $urlPagina)">
  <meta property="og:image" content="$(EscHtml $imagen)">
  <meta property="og:image:alt" content="$(EscHtml $p.nombre)">
  <meta name="twitter:card" content="summary_large_image">

  <script>location.replace("$destino");</script>
</head>
<body>
  <p>Abriendo el producto… <a href="$destino">Ver $(EscHtml $p.nombre)</a></p>
</body>
</html>
"@

  [System.IO.File]::WriteAllText((Join-Path $carpeta "$($p.id).html"), $html, $sinBom)
  Write-Host "OK  $urlPagina"
}
