
import React from "react";
import { Button } from "react-native";

function LogoutButton( {logoutHandler}: {logoutHandler: Function} ){
    return (
        <Button title='log out' onPress={logoutHandler}/>
    )
}

export default LogoutButton