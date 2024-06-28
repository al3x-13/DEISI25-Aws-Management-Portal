<script lang="ts">
	import type { Ec2Instance } from '@deisi25/types';
	import type { PageData } from './$types';
	import type { SSHKey } from '@deisi25/types/lib/resources/ssh/ssh';

	export let data: PageData;

	let instances: Ec2Instance[] = data.instances;
	let keys: SSHKey[] = data.keys;
</script>

<div>
	<p>Instances: {instances}</p>
	<p>Keys: {keys}</p>
</div>

