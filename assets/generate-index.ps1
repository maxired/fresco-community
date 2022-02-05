Import-Module Microsoft.PowerShell.Utility;

$array = [System.Collections.ArrayList]::new();

Get-ChildItem -Path ./background-sounds -Filter *.mp3 | 
Foreach-Object {
    $hash = @{}
    $hash.Add("filename" ,$_.Name);
    $hash.Add("name" ,[io.path]::GetFileNameWithoutExtension($_.Name).Replace('-', ' '));

    $array.Add($hash);
}

$result = ConvertTo-Json $array
Set-Content 'background-sounds/index.json' $result