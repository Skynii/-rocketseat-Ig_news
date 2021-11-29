import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import React from "react";
import { getPrismicCLient } from "../../services/prismic";

import styles from './post.module.scss';

{/*Pagina de post*/}
interface PostProps{
    post:{
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}
export default function Post( { post } : PostProps) {
    return(
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className ={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                    className ={styles.postContent}
                    dangerouslySetInnerHTML ={{ __html:post.content }} /> {/*Seta o conteudo como hteml */}

                </article>
            </main>
        </>
    );
}

{/* Antes de mostrar conteudo, usuario precisa estar logado.*/}

export const getServerSideProps: GetServerSideProps = async ({ req , params}) => {
    const session = await getSession ({ req })
    const {slug } = params;

    if (!session?.activeSubscription) {
        //redirecionamento para home em caso de nao estar ativo a assinatura
        return{
                redirect: {
            destination: '/',
            permanent:false,
            }   
        }
    }

    const prismic = getPrismicCLient(req);

    const response = await prismic.getByUID('post', String(slug), {})

    //Transforma o conteudo em HTML
    const post = { 
        slug,
        title:RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day:'2-digit',
            month: 'long',
            year:'numeric',
        })
    };

    
    
    return { 
        props:{
            post
        }
    }
        
    };
