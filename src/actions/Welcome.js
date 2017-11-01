import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

export const goToMain = () => {
    return (dispatch) => {
        const resetNavigator = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'MainScreen',
                })
            ],
        });
        dispatch(resetNavigator);
    }
}