$taskName = 'Start KodNest'
$bat = 'C:\Users\DELL\OneDrive\Desktop\app\kodnest\start-kodnest.bat'
Write-Output "Creating scheduled task '$taskName' to run: $bat"

# Create or update a task that runs on user logon
$cmd = "schtasks /Create /SC ONLOGON /TN \"$taskName\" /TR \"`"$bat`"\" /F"
Write-Output "Running: $cmd"
cmd /c $cmd

Write-Output "Scheduled task created. Open Task Scheduler to verify or edit its settings."
