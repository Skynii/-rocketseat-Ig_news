import { AppProps } from 'next/app';
import React from 'react';
import { SignInButton } from '../SignInButton';
import Link from 'next/link';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';
import { useRouter } from 'next/router';

export function Header(){
 


    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="images/logo.svg" alt="ig.news"/>
                <nav>
                    <ActiveLink activeClassName={styles.active} href= "/" >
                        <a >Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href= "/posts" >
                        <a>Post</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
       


        </header>
    );
}