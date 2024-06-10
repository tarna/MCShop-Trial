import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class HasLinkedCommand {
	@Slash({ name: 'has-liked', description: 'Check if a user has liked a server on NameMC' })
	async hasLinked(
		@SlashOption({
			name: 'server',
			description: 'The server to check the user on',
			type: ApplicationCommandOptionType.String,
			required: true
		})
		server: string,
		@SlashOption({
			name: 'username',
			description: 'The username to check',
			type: ApplicationCommandOptionType.String,
			required: true
		})
		username: string,
		interaction: CommandInteraction
	) {
		try {
			const mojangRequest = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
			const mojang = await mojangRequest.json();
			const uuid = mojang.uuid;

			const request = await fetch(`https://api.namemc.com/server/${server}/likes`);
			const likes = await request.json() as string[];

			if (likes.includes(uuid)) {
				const embed = new EmbedBuilder()
					.setTitle(`${username} has liked ${server}!`)
					.setColor('#313338');
				interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				const embed = new EmbedBuilder()
					.setTitle(`${username} has not liked ${server}!`)
					.setColor('#313338');
				interaction.reply({ embeds: [embed], ephemeral: true });
			}
		} catch (error) {
			console.error(error);
			interaction.reply({ content: `Unable to find user ${username} or server ${server}!` });
		}
	}
}