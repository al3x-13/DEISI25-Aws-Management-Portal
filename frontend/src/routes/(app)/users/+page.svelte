<script lang="ts">
    import { onMount } from 'svelte';
    import { listUsers } from "../../../global/user-instances";

	// I need to know if who is managing roles is the root account or the administrator account because in terms of deleting and editing roles.
	// For example, root account can't delete itself. An administrator can't remove itself

    interface User {
        id: number;
        username: string;
        email: string;
        role: string;
        date: string;
    }

    let users: User[] = []; 
	let userToDelete: User | null = null;

    onMount(async () => {
		const userInfoList = await listUsers();
		console.log(userInfoList);
		
		users = userInfoList.map(userInfo => ({
			id: userInfo.id,
			username: userInfo.username,
			email: userInfo.email,
			role: userInfo.role,
			date: userInfo.createdAt.slice(0, 10)
		}));
    });

    function editUser(id: number) {}

    async function deleteUser(id: number) {
        userToDelete = users.find(user => user.id === id) || null;
    }

	async function confirmDelete() { // TO-DO | Execute SQL query to delete the USER
        if (userToDelete) {
            users = users.filter(user => user.id !== userToDelete!.id);
            userToDelete = null;
        }
    }

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
                        <button class="hover-light" on:click={() => editUser(user.id)}>
                            <ion-icon name="create-outline" />
                        </button>
                        <button on:click={() => deleteUser(user.id)}>
                            <ion-icon name="trash-outline" />
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
	{#if userToDelete}
        <div class="confirm-popup">
            <div class="color-primary-light confirm-popup-content">
                <p>Do you pretend to delete user "{userToDelete.username}"?</p>
                <div class="buttons">
                    <button on:click={confirmDelete}>Confirm</button> <!-- TO-DO | Execute SQL query to delete the USER -->
                    <button on:click={() => userToDelete = null}>Cancel</button>
                </div>
            </div>
        </div>
    {/if}
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
        text-align: center;

    }

	button {
        margin: 0 5px;
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

	button:hover {
        background-color: #0056b3;
    }

	.confirm-popup {
        position: fixed;
		background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .confirm-popup-content {
		color: rgb(255, 255, 255);
		background-color: #0f1c3b;
        padding: 20px;
        border-radius: 8px;
        max-width: 400px;
        text-align: center;
    }

    .buttons {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
</style>
