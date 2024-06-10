const server = 'mc.paladium-pvp.fr'

async function main() {
	const data = await fetch(`https://api.namemc.com/server/${server}/likes`)
	const likes = await data.json() as string[]

	const names = []
	for (const like of likes) {
		const mojangData = await fetch(`https://api.ashcon.app/mojang/v2/user/${like}`)
		const mojang = await mojangData.json()
		names.push(mojang.username)
	}

	console.log(names)
}
main()