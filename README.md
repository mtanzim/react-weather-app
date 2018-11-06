# React Weather App

## Feedback

[Ideal solution](https://drive.google.com/open?id=1R7oMX79Gy2YnVKwslYMPAS2eRXRLkEOU)

### Notes

- Simple is beautiful
- Note css structure in ideal solution
- Note the use of PropTypes
- DO NOT use componentWillMount() for async data load; use componentDidMount instead
- Note the usage of render functions for cleaner and more readable code
- Note the differences in storing current state and history
  - Arrays vs Objects: why use objects and then convert back to array?
  - No need for a seperate data structure for histroy!
- State reversal was not a User Story! This made the code messier and more bloated (watch for feature creep)


## Usage

- The API endpoint will be called every 5 mins
- If the server responds, the server data will be used
- Otherwise, 2 mock data sets are stored locally for testing the app; the app will fetch either one randonly
- Note the difference in the 2 data sets:

- mock1
```json
  "weather": [{
    "id": 800,
    "main": "Clear",
    "description": "clear sky",
    "icon": "01d"
  }],
```

- mock2

```json
  "weather": [{
    "id": "ABC",
    "main": "Clear",
    "description": "clear sky",
    "icon": "01d"
  }],
```

- The history of each API call is stored in the History section
- The blue buttons with the Unix timestamp allow toggling between the state history
- Please click the red refresh button to refresh the page and reset the timers


## Requirements

Please create a React app for us that queries the current weather from openweathermap.org and displays the data fetched for the user.
Get started by creating a React app using create-react-app.
We want your app to do the following things:

- Query data from <http://api.openweathermap.org/data/2.5/weather?q=Berlin&APPID=82f13ccba8452fb77eab61ee10ce5d53>
- Display the current weather information for Berlin
- Update every 5 minutes or if the user clicks a refresh button
- Display a table that contains every update fetched
- Keep in mind that the api endpoint can only be queried 60 times a minute (you’ll get a timeout for requests beyond that). This is just an FYI and nothing you’ll have to handle in your code.
- Also, this task is only meant to get an idea of what your code structure and problem solving looks like. We do not care about the design. You don’t have to spend any time on making the app look pretty. We want to get a feel for what you code like only.