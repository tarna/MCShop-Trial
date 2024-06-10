import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder } from 'discord.js';
import { ButtonComponent, Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class LikesCommand {
	@Slash({ name: 'likes', description: 'Get the likes of a Minecraft server on NameMC' })
	async likes(
		@SlashOption({
			name: 'server',
			description: 'The server to get the likes of',
			type: ApplicationCommandOptionType.String,
			required: true
		})
		server: string,
		interaction: CommandInteraction
	) {
		try {
			const request = await fetch(`https://api.namemc.com/server/${server}/likes`);
			const likes = await request.json() as string[];

			const embed = new EmbedBuilder()
				.setTitle(`Likes for ${server}`)
				.setColor('#313338')
				.addFields([
					{
						name: 'Total Likes',
						value: likes.length.toString()
					},
					{
						name: 'Likes',
						value: (await this.getNames(likes.slice(0, 5))).join(', ')
					}
				])
				.setFooter({ text: `1/${Math.floor(likes.length / 5) + 1}` });

			const nextPageButton = new ButtonBuilder()
				.setCustomId(`next:${server}:1`)
				.setLabel('Next')
				.setStyle(ButtonStyle.Primary);

			const backPageButton = new ButtonBuilder()
				.setCustomId(`back:${server}:1`)
				.setLabel('Back')
				.setStyle(ButtonStyle.Primary);
			
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(backPageButton, nextPageButton);

			interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
		} catch (error) {
			console.error(error);
			interaction.reply({ content: `Server ${server} does not exist!` })
		}
	}

	@ButtonComponent({ id: /^next:.+:\d+$/ })
	async nextPage(interaction: ButtonInteraction) {
		const [_, server, page] = interaction.customId.split(':');
		const request = await fetch(`https://api.namemc.com/server/${server}/likes`);
		const likes = await request.json() as string[];

		const pageNum = parseInt(page);

		const embed = new EmbedBuilder()
			.setTitle(`Likes for ${server}`)
			.setColor('#313338')
			.addFields([
				{
					name: 'Total Likes',
					value: likes.length.toString()
				},
				{
					name: 'Likes',
					value: (await this.getNames(likes.slice(pageNum * 5, pageNum * 5 + 5))).join(', ')
				}
			])
			.setFooter({ text: `${pageNum + 1}/${Math.floor(likes.length / 5) + 1}` });

		const nextPageButton = new ButtonBuilder()
			.setCustomId(`next:${server}:${pageNum + 1}`)
			.setLabel('Next')
			.setStyle(ButtonStyle.Primary);

		const backPageButton = new ButtonBuilder()
			.setCustomId(`back:${server}:${pageNum - 1}`)
			.setLabel('Back')
			.setStyle(ButtonStyle.Primary);
		
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(backPageButton, nextPageButton);

		interaction.update({ embeds: [embed], components: [row] });
	}

	@ButtonComponent({ id: /^back:.+:\d+$/ })
	async backPage(interaction: ButtonInteraction) {
		const [_, server, page] = interaction.customId.split(':');
		const request = await fetch(`https://api.namemc.com/server/${server}/likes`);
		const likes = await request.json() as string[];

		const pageNum = parseInt(page);

		const embed = new EmbedBuilder()
			.setTitle(`Likes for ${server}`)
			.setColor('#313338')
			.addFields([
				{
					name: 'Total Likes',
					value: likes.length.toString()
				},
				{
					name: 'Likes',
					value: (await this.getNames(likes.slice(pageNum * 5, pageNum * 5 + 5))).join(', ')
				}
			])
			.setFooter({ text: `${pageNum + 1}/${Math.floor(likes.length / 5) + 1}` });

		const nextPageButton = new ButtonBuilder()
			.setCustomId(`next:${server}:${pageNum+ 1}`)
			.setLabel('Next')
			.setStyle(ButtonStyle.Primary);

		const backPageButton = new ButtonBuilder()
			.setCustomId(`back:${server}:${pageNum - 1}`)
			.setLabel('Back')
			.setStyle(ButtonStyle.Primary);
		
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(backPageButton, nextPageButton);

		interaction.update({ embeds: [embed], components: [row] });
	}

	private async getNames(likes: string[]) {
		const names = [];
		for (const like of likes) {
			const mojangData = await fetch(`https://api.ashcon.app/mojang/v2/user/${like}`);
			const mojang = await mojangData.json();
			names.push(mojang.username);
		}
		return names;
	}
}