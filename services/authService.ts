import { authHost, lifeSessionTimeInMin } from "../constants/auth.constants";

async function authService(username, password) {

  try {
    const response = await fetch(`${authHost}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: lifeSessionTimeInMin,
      }),
      
    });
  
    if(!response.ok){
      await response.json();
      throw new Error(response.message);
    }
  
    return response.json();
  } catch (error) {
    alert("Error in login")

    return undefined;
  }
}

export default authService;
