import {jwtDecode} from "jwt-decode";

type UserDecoded = {
  person_id: string
};

export function getUserID(token: string) {
  return jwtDecode<UserDecoded>(token).person_id;
}

export function checkTokenExpiration(token: string) {
  if (jwtDecode(token).exp) {
    // @ts-ignore stoopid error "exp is undefined hurr bur" shut up
    return jwtDecode(token).exp - Math.round(Date.now() / 1000) < 3000
    // return true; // for testing
  } else {
    console.log('possible error in token');
  }
}