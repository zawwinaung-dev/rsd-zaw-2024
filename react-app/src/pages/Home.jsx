import { Typography } from '@mui/material';
import Item from "../components/Item";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useApp } from "../AppProvider";
import Form from '../components/Form';

const api = "http://localhost:8080/posts";

async function fetchPosts() {
    const res = await fetch(api);
    
    return res.json();
}

async function deletePost(id) {
    const res = await fetch(`${api}/${id}`, {
        method: 'Delete',
    });

    return res.json();
}



export default function Home() {
    const { data, error, isLoading } = useQuery("posts", fetchPosts);
    const queryClient = useQueryClient();
    const { showForm } = useApp();

    const remove = useMutation(deletePost, {
        onMutate: id => {
            queryClient.setQueryData("posts", old => {
                return old.filter(post => {
                    return post.id != id;
                });
            });
        },
        // onSuccess: async () => {
        //     await queryClient.cancelQueries();
        //     await queryClient.invalidateQueries("posts");
        // }
    })

    if(isLoading) {
        return <Typography>Loading...</Typography>
    }

    return (
        <>
            { showForm && <Form /> }

            {data.map(post => {
                return (
                    <Item key={post.id} post={post} remove={remove.mutate} />
                )
            })}
        </>
    )
}