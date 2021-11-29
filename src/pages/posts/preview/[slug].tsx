import {  GetStaticProps, GetStaticPaths } from "next";
import { RichText } from "prismic-dom";
import { useSession } from "next-auth/client";
import { getPrismicCLient } from "../../../services/prismic";

import { useRouter } from "next/router";

import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import Posts from "..."

import styles from '../post.module.scss';

{/*Pagina de post*/}
interface PostPreviewProps{
    post:{
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}
export default function PostPreview( { post } : PostPreviewProps) {
    const [session]=useSession();
    const router = useRouter();

    useEffect(() => {
        if(session?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }

    }, [post.slug, router, session])

    return(
        <>
            <Head>
                <title>{post.title} | Ig.news</title>
            </Head>

            <main className={styles.container}>
                <article className ={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                    className ={`${styles.postContent} ${styles.previewContent}`}
                    dangerouslySetInnerHTML ={{ __html:post.content }} /> 
                    
                    <div className ={styles.continueReading}>
                        Wanna continue reading?
                        <Link href= '/'>
                            <a href="">Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    
    return {
        paths:[
            
        ],
        fallback: 'blocking'
    }
}

{/* Antes de mostrar conteudo, usuario precisa estar logado.*/}

export const getStaticProps: GetStaticProps = async ({  params }) => {
    
    const { slug } = params;    

    const prismic = getPrismicCLient();

    const response = await prismic.getByUID("post", String(slug), {})

    //Transforma o conteudo em HTML
    const post = { 
        slug,
        title:RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day:'2-digit',
            month: 'long',
            year:'numeric',
        })
    };

    
    
    return { 
        props:{
            post,
        },
        redirect: 60 * 30, //post atualizado em 30 minutos
    }
        
    };
