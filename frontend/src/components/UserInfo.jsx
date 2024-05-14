
const UserInfo = ({user})=>{
        return (
            <div>
                <h1>Welcome {user.username}</h1>
                <a href="/auth/logout">Logout</a>
            </div>
        );
    }

export default UserInfo;
