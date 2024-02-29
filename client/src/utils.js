// const refreshToken = async (user, setIsLoading, doSetUser) => {
//   const refresh = await fetch(
//     `http://${process.env.REACT_APP_DOMAIN}/refreshToken`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify({ token: user.refreshToken }),
//     }
//   );
//   const refreshData = await refresh.json();
//   localStorage.setItem("brt-jwt", JSON.stringify(refreshData));
//   doSetUser(refreshData);
//   setIsLoading(false);
// };

export const setToken = async (setIsLoading, doSetUser) => {
  const brtJWT = localStorage.getItem("brt-jwt");
  if (brtJWT) {
    const verify = await fetch(`${process.env.REACT_APP_DOMAIN}/verifyToken`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${brtJWT}`,
      },
      method: "POST",
    });
    const verifyData = await verify.json();
    if (verifyData?.errMessage) {
      localStorage.removeItem("brt-jwt");
      //  refreshToken(user, setIsLoading, doSetUser);
      setIsLoading(false);
    } else {
      doSetUser(verifyData);
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};

export const compareObjects = (obj1, obj2) => {
  // Check if both arguments are objects
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if each key in obj1 exists in obj2 with the same value
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  // If all checks pass, objects are equal
  return true;
};
