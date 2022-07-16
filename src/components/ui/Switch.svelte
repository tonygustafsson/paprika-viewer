<script lang="ts">
	export let label: string;
	export let name: string;
	export let checked: boolean;
</script>

<label>
	<input type="checkbox" {name} {checked} on:change />
	<div class="switch" />
	{label}
</label>

<style>
	label {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	input {
		height: 0;
		width: 0;
		visibility: hidden;
	}

	.switch {
		cursor: pointer;
		width: 30px;
		height: 15px;
		background: var(--color-secondary);
		display: block;
		border-radius: 4px;
		position: relative;
		margin-right: 8px;
	}

	.switch:after {
		content: '';
		position: absolute;
		top: 1px;
		left: 0;
		width: 14px;
		height: 14px;
		background: #fff;
		border-radius: 50%;
		transition: 0.3s;
	}

	input:checked + .switch {
		background: var(--color-primary);
	}

	input:checked + .switch:after {
		left: 100%;
		transform: translateX(-100%);
	}
</style>
