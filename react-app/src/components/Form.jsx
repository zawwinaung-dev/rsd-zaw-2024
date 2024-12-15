import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";

import {
    OutlinedInput,
    IconButton,
} from '@mui/material'

import {
    Add as AddIcon
} from '@mui/icons-material'

async function  postPost(content) {
    const api = "http://localhost:8080/posts";
    const res = await fetch(api, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return res.json();    
}

export default function Form() {
const inputRef = useRef();
const queryClient = useQueryClient();

const add = useMutation(postPost, {
    onSuccess: async item => {
        await queryClient.cancelQueries();
        await queryClient.setQueryData("posts", old => {
            return [ item, ...old ];
        })
    }
});

    return (
        <form style={{ marginBottom: 20, display: "flex"}} onSubmit={ e => {
                e.preventDefault();
                
            const content = inputRef.current.value;
            content && add.mutate(content);
            // add(content);

            e.currentTarget.reset();
        }}>
            <OutlinedInput 
                type="text"
                style={{ flexGrow: 1}}
                inputRef={inputRef}
                endAdornment={
                    <IconButton>
                        <AddIcon />
                    </IconButton>
                }
            />
        </form>
 )
}