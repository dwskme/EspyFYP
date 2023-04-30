import React, { useContext } from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import $ from 'jquery';
import NavBar from '../../components/layout/NavBar';
import { BsSearch } from 'react-icons/bs';
import UserRow from './UserRow';
import { UserContext } from '../../utils/userContext';
import Stats from './Stats';
import Info from './Info';
import { TopUserProvider } from '../../utils/topUserContext';
import Sidebar from '../../components/layout/SideBar'
export default function UserManagement() {

    const [user, setUser] = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState(null);
    const [searchValue, setSearchValue] = useState();

    useEffect(() => {
        axios.get('/api/v1/admin/users').then(function (result) {
            setUsers(result.data.users);
        })
    }, [])

    const searchUser = (query) => {
        axios.get(`/api/v1/admin/search/${query}`).then(function (result) {
            if (result.data?.user !== undefined) {
                // console.log("this is result.data.user: "+ result.data.user?.email)
                setSearch(result.data.user)
            }
        })
    }
    const handleSubmit = (evt) => {
        searchUser(searchValue);
        evt.preventDefault();
    }


    if (user?.role === 'admin') {
        return (
            <TopUserProvider>
                <div>
                    <div>
                        <NavBar className="text-secondary"></NavBar>

                        <div className='d-flex'>
                            <div className='nav-wrapper'>
                                <Sidebar></Sidebar>
                            </div>
                            <div className='container-fluid'>
                                <div className='col-xl-10 mx-auto'>
                                    <h4 className='mt-5 mb-3'>Overview</h4>
                                    <Info></Info>
                                    <div className='mx-auto my-5'>
                                        <div>
                                            <Stats> </Stats>
                                        </div>
                                    </div>

                                    <h4 id='users' className='mt-5 mb-3'>Users</h4>
                                    <div className=''>
                                        {/* <div className='border d-flex w-25 rounded px-3 py-1 my-2'>
                                            <input onBlur={() => $('.users').remove()} onChange={e => setSearchValue(e.target.value)} style={{ border: "none", outline: "none" }} className='w-100' type="text" />
                                            <button className='ms-auto border' onClick={handleSubmit} >
                                                <BsSearch />
                                            </button>
                                        </div> */}
                                    </div>
                                    <div className='mb-5'>
                                        <table className='rounded border border-secondary shadow table table-hover'>
                                            <thead>
                                                <tr>
                                                    <td className='fw-bold'>Name</td>
                                                    <td className='fw-bold'>E-Mail</td>
                                                    <td className='fw-bold'>Age</td>
                                                    <td className='fw-bold'>Gender</td>
                                                    <td className='fw-bold'>Role</td>
                                                    <td className='fw-bold'>Actions</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    search !== null ?
                                                        <UserRow user={search}></UserRow>
                                                        :
                                                        <></>
                                                }
                                            </tbody>
                                            <tbody className='users'>

                                                {
                                                    users.map((user, index) => {
                                                        return <UserRow key={index} index={"index" + index} user={user}></UserRow>
                                                    })

                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </TopUserProvider>

        );
    } else if (user?.role === "user") {
        return window.location.href = "/"
    }
    return 1
}
