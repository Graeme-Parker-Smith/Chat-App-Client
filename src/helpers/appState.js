const [appState, setAppState] = useState(AppState.currentState);
useEffect(() => {
  console.log("mounting!");
  registerForNotifications();
  AppState.addEventListener("change", _handleAppStateChange);
  return () => {
    AppState.removeEventListener("change", _handleAppStateChange);
  };
}, []);


const _handleAppStateChange = nextAppState => {
  if (nextAppState.match(/inactive|background/) && appState === "active") {
    console.log("App has come to the foreground!");
  }
  console.log(nextAppState);
  setAppState(nextAppState);
};