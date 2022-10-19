# redux-map-tracker

## Test

### Expected Outcome of how app should work

`Step 1` Click on tracking button
`Step 2` Walk around for a bit
`Step 3` Click on tracking button
`Step 4` Prompts user to save tracked positions or to clear the tracked positions
`Step 5` If clicks on Save Data button it saves the data to the Users Settings Redux variable
`Step 6` Deletes data from Recorded Position Redux variable

### Test Cases

`t0`  Tracking Disabled
`t1`  Tracking Enabled
`b0`  Click tracking button with disabled value
`b1`  Click tracking button with enabled value
`b3`  Don't click button
`l0`  Data array Length of zero
`l1`  Data array Length of one
`l2`  Data array Length greater than one
`c0`  Clear data button
`c1`  Save data button

### Actions

`I`   Impossible
`a0`  Do nothing
`a1`  Return position to redux variable data array
`a2`  Start Geolocation watch
`a3`  Stop Geolocation watch
`a4`  Save data to activity data
`a5`  Clear data array
`a6`  Cannot save data
