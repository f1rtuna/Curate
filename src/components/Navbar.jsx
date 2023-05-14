import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { ethers } from 'ethers'
import "../styles/navbar.css"


function Navbar({account, setAccount}) {

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
    }
    return (
    <nav className='navbar'>
        <Link className="left-nav" to="/">
            <div className="logo">
            </div>
            <div className="firtuna">Curate</div>
        </Link>
        <div className="right-nav" onClick = {connectHandler}>
            <div className="profile">
                <CgProfile/>
            </div>
            <div className="metamask-button">
                {account ? (
                    <div>
                        {account.slice(0, 6) + '...' + account.slice(38, 42)}
                    </div>
                ) : (
                    <div onClick={connectHandler}>
                        Connect
                    </div>
                )}
            </div>
        </div>
    </nav>
    )
}

export default Navbar