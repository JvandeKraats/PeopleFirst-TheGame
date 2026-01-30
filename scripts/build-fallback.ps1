param(
  [Parameter(Mandatory=$true)]
  [string]$AccessToken,

  # Input file (your pasted JSON)
  [string]$InputPeopleDataPath = "C:\Users\BrendanBarghus\RiderProjects\Xebia\PeopleFirst-TheGame\src\data\inputPeopleData.json",

  # Output locations
  [string]$PhotoOutputDir = "C:\Users\BrendanBarghus\RiderProjects\Xebia\PeopleFirst-TheGame\public\fallback-photos",
  [string]$JsonOutputPath = "C:\Users\BrendanBarghus\RiderProjects\Xebia\PeopleFirst-TheGame\src\data\people-fallback.json",

  # URL path written into JSON
  [string]$PublicPhotoPrefix = "/fallback-photos",

  # Used when photo download fails or user has no photo
  [string]$FallbackPhotoPublicPath = "/fallback-photos/fallback.jpg"
)

$ErrorActionPreference = "Stop"

function Get-HttpStatusCodeFromException {
  param($Exception)
  $status = $null
  try { $status = $Exception.Response.StatusCode.value__ } catch {}
  return $status
}

function Load-People {
  param([string]$Path)

  if (!(Test-Path $Path)) { throw "Input file not found: $Path" }

  $json = Get-Content $Path -Raw | ConvertFrom-Json

  # Support both:
  # { "value": [ ... ] }
  # and
  # [ ... ]
  if ($json -is [System.Collections.IEnumerable] -and -not ($json.PSObject.Properties.Name -contains "value")) {
    return $json
  }

  if ($json.PSObject.Properties.Name -contains "value") {
    return $json.value
  }

  throw "JSON format not recognized. Expected an array or an object with a 'value' array."
}

function Download-UserPhoto {
  param(
    [Parameter(Mandatory=$true)][string]$UserId,
    [Parameter(Mandatory=$true)][string]$OutFile,
    [Parameter(Mandatory=$true)][hashtable]$Headers
  )

  # IMPORTANT: escape $value in PowerShell
  $url = "https://graph.microsoft.com/v1.0/users/$UserId/photo/`$value"

  try {
    Write-Host "Downloading: $url"
    Invoke-WebRequest -Method GET -Uri $url -Headers $Headers -OutFile $OutFile | Out-Null
    return $true
  } catch {
    # Try to read the actual status code + body
    $status = $null
    try { $status = $_.Exception.Response.StatusCode.value__ } catch {}

    $body = $null
    try {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $body = $reader.ReadToEnd()
    } catch {}

    if ($status -eq 404) {
      Write-Host "⚠️  No photo for $UserId (404)"
      return $false
    }

    Write-Host "❌ Photo download failed for $UserId (status: $status)"
    if ($body) { Write-Host "   Body: $body" }
    return $false
  }
}

# ---- Main -------------------------------------------------------------

$headers = @{ Authorization = "Bearer $AccessToken" }

# Ensure folders exist
New-Item -ItemType Directory -Path $PhotoOutputDir -Force | Out-Null
New-Item -ItemType Directory -Path (Split-Path $JsonOutputPath) -Force | Out-Null

# Warn if fallback image missing on disk
$fallbackDiskPath = Join-Path ".\public" ($FallbackPhotoPublicPath.TrimStart("/") -replace "/", "\")
if (!(Test-Path $fallbackDiskPath)) {
  Write-Host "⚠️  Fallback image not found on disk: $fallbackDiskPath"
  Write-Host "   Create it (e.g. public\fallback-photos\fallback.jpg) to avoid broken images."
}

Write-Host "Loading input people data from: $InputPeopleDataPath"
$people = Load-People -Path $InputPeopleDataPath
if (-not $people -or $people.Count -eq 0) { throw "No people found in input file." }

$out = @{ value = @() }

foreach ($p in $people) {
  $id = $p.id
  if ([string]::IsNullOrWhiteSpace($id)) { continue }

  # Only keep org users (optional but aligns with your goal)
  if ($p.personType -and $p.personType.subclass -and $p.personType.subclass -ne "OrganizationUser") {
    continue
  }

  $photoDiskFile = Join-Path $PhotoOutputDir "$id.jpg"
  $hasPhoto = Download-UserPhoto -UserId $id -OutFile $photoDiskFile -Headers $headers

  $entry = [ordered]@{
    id          = $id
    displayName = $p.displayName
    givenName   = $p.givenName
    surname     = $p.surname
    personType  = $p.personType
    photo       = if ($hasPhoto) { "$PublicPhotoPrefix/$id.jpg" } else { $FallbackPhotoPublicPath }
  }

  $out.value += $entry
}

# Write output JSON
$out | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $JsonOutputPath

Write-Host ""
Write-Host "✅ Done"
Write-Host "Photos saved to: $PhotoOutputDir"
Write-Host "JSON written to:  $JsonOutputPath"
Write-Host "Entries:          $($out.value.Count)"
Write-Host ""
Write-Host "Reminder: set VITE_USE_FALLBACK=true to use this file in the app."
