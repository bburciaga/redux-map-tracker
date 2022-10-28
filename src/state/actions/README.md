# ACTIONS SPEC SHEET

## USER SETTINGS

`error` Used to define any error that happened during action events

`is_tracking` Used to enable GPS tracking to draw recorded positions
onto a map as a line string.
> To enable the action `USER_SETTINGS_ENABLE_POSITION_TRACKING` must
> be dispatched.
> To disable the action `USER_SETTINGS_DISABLE_POSITION_TRACKING` must
> be dispatched.

`show_position: boolean` Used to enable GPS tracking to place a marker
at your current location.
> To enable the action `USER_SETTINGS_ENABLE_SHOW_POSITION` must be
> dispatched.
> TO disable the action `USER_SETTINGS_DISABLE_SHOW_POSITION` must be
> dispatched.

`watch_id: number` a number id to indicate the id for GPS tracking
and when it's watching.
> To update the id, the action `USER_SETTINGS_UPDATE_WATCH_ID` must
> be dispatched.
> To remove the id, the action `USER_SETTINGS_REMOVE_WATCH_ID` must
> be dispatched assigning a value of null.

`current_position: {lat: number, lng: number` if either is_tracking
OR show_position are enabled (both can be enabled at once) the
current_position shall be updated.
> To update the position, the action 
> must be dispatched.`USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS`.

`activity_data` if the user finishes GPS tracking drawing the 
linestring then the user can decide to save the recorded positions 
into this variable.
> To update, the action `USER_SETTINGS_SAVE_DATA_SUCCESS` must be
> dispatched.

### Toggling the Position Tracking
