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
polygon then the user can decide to save the recorded positions
into this variable.

> To update, the action `USER_SETTINGS_SAVE_DATA_SUCCESS` must be
> dispatched.

### Toggling the Position Tracking

To dispatch the actions for updating the `is_tracking` variable the
app must have a useDispatch() event to dispatch the ENABLE or DISABLE
actions.

### Toggling the Show Position

To dispatch the actions for updating the `show_position` variable the
app must have a useDispatch() event to dispatch the ENABLE or DISABLE
actions.

### Updating the Watch ID

The `watch_id` should be automatically updated through the userSettings
Saga. The following saga handlers update the id:

    - handle_USER_SETTINGS_ENABLE_POSITION_TRACKING
    - handle_USER_SETTINGS_DISABLE_POSITION_TRACKING
    - handle_USER_SETTINGS_ENABLE_SHOW_POSITION
    - handle_USER_SETTINGS_DISABLE_SHOW_POSITION

If the user decides to enable `show_position` it will dispatch one of
the follwing actions:

    - USER_SETTINGS_UPDATE_WATCH_ID
    - USER_SETTINGS_UPDATE_WATCH_ID_DENY
    - USER_SETTINGS_UPDATE_WATCH_ID_FAIL

> The DENY action happens if and only if `is_tracking` is enabled. This
> is because there is alreay a `watch_id` existing so we should not
> overwrite the ID.
>> The same actions dispatch when the user wants to enable `is_tracking`

If the user decides to disable `show_position` it will dispatch one of
the following actions:

    - USER_SETTINGS_REMOVE_WATCH_ID
    - USER_SETTINGS_UPDATE_WATCH_ID_DENY
    - USER_SETTINGS_UPDATE_WATCH_ID_FAIL

> The DENY action happens if and only if `is_tracking` is enabled. This
> is because we wouldn't want to remove the ID if the user was still
> tracking their position, but wanted to disable the marker.
>> The same actions dispatch when the user wants to disable `is_tracking`

### Updating the Current Position and Recorded Positions Array

If there is a `watch_id` and `is_tracking` or `show_position` are true
then the findMe() function will dispatch a
`USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST`. The following actions
can be dispatched:

    - USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS
    - USER_SETTINGS_UPDATE_CURRENT_POSITION_DENY
    - USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL

> The DENY action happens if and only if there is a `current_position`
> and if the fetched position from the GPS is less than value 1.5 m from
> the previous position.
>> This is to avoid having clusters of data in your general position
>> since the GPS data isn't 100% accurate.

If there is a successful update to the `current_position` the following
actions will be dispatch:

    - RECORDED_POSITION_UPDATE_REQUEST
    - RECORDED_POSITION_UPDATE_FAIL

> The `recordedPosition` reducer is where we have an array of positions
> to be drawn as a Polygon for the map.

### Saving Recorded Positions to User Settings State

After the user disables `is_tracking` the user should be followed up
with a `USER_SETTINGS_SAVE_DATA_REQUEST`. Upon this REQUEST action the
follwoing actions could be dispatched:

    - USER_SETTINGS_SAVE_DATA_SUCCESS
    - USER_SETTINGS_SAVE_DATA_DENY
    - USER_SETTINGS_SAVE_DATA_FAIL

> The DENY action happens if and only if there is not enough positions
> in recorded positions state. This is to avoid any crashes that could
> happen with turf creating a Polygon feature.

If the REQUEST triggers the SUCCESS action the following actions will
be dispatched:

    - RECORDED_POSITION_CLEAR_DATA_SUCCESS
    - RECORDED_POSITION_CLEAR_DATA_FAIL

> The purpose is to clear the recorded positions in the case that we
> want to record a new set of positions.

If the REQUEST triggers the DENY action the following actions will be
dispatched:
 
    - RECORDED_POSITION_CLEAR_DATA_SUCCESS
    - RECORDED_POSITION_CLEAR_DATA_FAIL

> If there was a lack of positions in the Recorded Positions state then
> the positions should be cleared if the user wants to reattempt to
> record the positions again.

## RECORDED POSITIONS

`error` Used to define any error that happened during action events

`data` Used to store latitude and longitude variables as an array.
> E.g. [[lng0, lat0], [lng1, lat1], ..., [lngn, latn]]

### Update Request

The REQUEST will be dispatched when
`USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS` is triggered by the saga.
On `RECORDED_POSITION_UPDATE_REQUEST` the saga will dispatch the
following:

    - RECORDED_POSITION_UPDATE_SUCCESS
    - RECORDED_POSITION_UPDATE_FAIL

> There is no DENY action because this should be handled during the
> action `USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST`

### Clear Data Request

The REQUEST will be dispatched by either
`USER_SETTINGS_SAVE_DATA_SUCCESS` or by a custom made trigger button
to dispatch it. The `RECORDED_POSITION_CLEAR_DATA_REQUEST` will 
either trigger the following actions:

    - RECORDED_POSITION_CLEAR_DATA_SUCCESS
    - RECORDED_POSITION_CLEAR_DATA_FAIL
    - USER_DATA_SAVE_DATA_REQUEST

> We have `USER_DATA_SAVE_DATA_REQUEST` in case the user wants to
> save the data as a feature to the User Settings state.
>> After a `USER_DATA_SAVE_DATA_SUCCESS` or `USER_DATA_SAVE_DATA_DENY`
>> this REQUEST will be triggered again.