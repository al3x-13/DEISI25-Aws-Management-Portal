<script lang="ts">
    import { onMount } from 'svelte';
    import { listUsers } from "../../../global/user-instances";

    interface User {
        id: number;
        username: string;
        email: string;
        role: string;
        date: string;
    }

    let users: User[] = []; 

    onMount(async () => {
		const userInfoList = await listUsers();
		users = userInfoList.map(userInfo => ({
			id: userInfo.id,
			username: userInfo.username,
			email: userInfo.email,
			role: userInfo.role,
			date: '' 
		}));
    });

    // function editUser(id: number) {}

    // function deleteUser(id: number) {}
</script>

<main>
    <table>
        <thead>
            <tr class="text-color-primary-dark dark:bg-bg2-dark">
                <th style="text-align: center;">Username</th>
                <th style="text-align: center;">Email</th>
                <th style="text-align: center;">Role</th>
                <th style="text-align: center;">Date</th>
                <th style="text-align: center;">Action</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user (user.id)}
                <tr style="border-bottom: 1px solid white;">
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.date}</td>
                    <td>
                        <!-- <button on:click={() => editUser(user.id)}>
                            <ion-icon name="create-outline" />
                        </button>
                        <button on:click={() => deleteUser(user.id)}>
                            <ion-icon name="trash-outline" />
                        </button> -->
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        margin: auto;
    }

    table {
        width: 100%;
        margin-bottom: 20px;
    }

    th, td {
        padding: 10px;
        text-align: left;
    }
</style>
