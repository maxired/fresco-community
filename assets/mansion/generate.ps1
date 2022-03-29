$files = Get-ChildItem -Path . -Filter *.png
$data = @()
Foreach ($file in $files) {
    $newFileName = $file.Name.Replace(", ", "-").ToLowerInvariant()
    Rename-Item -Path $file.FullName -NewName $newFileName

    $TextInfo = (Get-Culture).TextInfo
    $assetName = $TextInfo.ToTitleCase($newFileName.Replace("-", " "));
    $data = $data + @{ name = $assetName; filename = $newFileName };
}

$result = $data | ConvertTo-Json
Set-Content -Path furniture.json -Value $result