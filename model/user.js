import UserPassword from "./user_password.js";

class User {
    id;
    name;
    lastName;
    userName;
    email;
    photo;
    password;
    constructor() {
        this.id = "";
        this.name = "";
        this.lastName = "";
        this.userName = "";
        this.email = "";
        this.photo = "";
        this.password = new UserPassword();
    }
}
export default User;