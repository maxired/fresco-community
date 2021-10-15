Import-Module Microsoft.PowerShell.Utility;

$array = [System.Collections.ArrayList]::new();

Get-ChildItem -Path . -Filter *.png | 
Foreach-Object {
    $hash = @{}
    $hash.Add("filename" ,$_.Name);
    $hash.Add("name" ,[io.path]::GetFileNameWithoutExtension($_.Name).Replace('-', ' '));

    $array.Add($hash);
}

$result = ConvertTo-Json $array
Set-Content 'index.json' $result