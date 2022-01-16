import { UserService } from '@app/_services';

export function appUserInitializer(userService: UserService) {
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        userService.getUser()
            .subscribe()
            .add(resolve);
    });
}