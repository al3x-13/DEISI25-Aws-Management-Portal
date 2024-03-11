<script>
	// import { getUserByID} from '../../../global/ec2-instances';

	let users = [
		{ id: 1, username: 'User1', email: 'user1@gmail.com', role: 'Admin', date: '2024-01-12' },
		{ id: 2, username: 'User2', email: 'user2@gmail.com', role: 'User', date: '2024-02-01' },
		{ id: 3, username: 'User3', email: 'user3@gmail.com', role: 'User', date: '2024-02-02' }
	];

	function editUser(id) {}

	function deleteUser(id) {}
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
						<button on:click={() => editUser(user.id)}>
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

	th,
	td {
		padding: 10px;
		text-align: left;
	}

	button {
		padding: 10px;
		margin-top: 10px;
		cursor: pointer;
	}
</style>
