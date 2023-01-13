addLayer("lv", {
    name: "lv", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "lv", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	    points: new Decimal(1),
        autoLevel: false
    }},
    color: "#26abff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "levels", // Name of prestige currency
    baseResource: "grass", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    canBuyMax() { return hasMilestone("pp", 0) },
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("lv",12))
        mult = mult.mul(buyableEffect("pp",12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "L: Reset for levels", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    automate() {},
    /*upgrades: {
        11: {
            title: "That was"
        }
    },*/
    buyables: {
        11: {
            title: "Grass value",
            cost(x) { return new Decimal(2).pow(x).mul(10).floor() },
            effect(x) { return new Decimal(1).add(x).mul(new Decimal(2).pow(x.div(25).floor())) },
            display() { return `Increases grass gained by 100%
                                Doubles effect every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/250
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("cs", 0)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(250)
        },
        12: {
            title: "XP",
            cost(x) { return new Decimal(2).pow(x).mul(15).floor() },
            effect(x) { return new Decimal(1).sub(x.div(100)).mul( new Decimal(1).sub(0.05).pow(x.div(25).floor())) },
            display() { return `Decreases level requirement by 1%
                                Decreases by 5% (multiplicative) every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/75
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("cs", 0)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(75)
        },
        13: {
            title: "Speed",
            tooltip: "log10(time)^(0.8+0.2*x)*x",
            cost(x) { return new Decimal(10).pow(x).mul(1000).floor() },
            effect(x) { return new Decimal(player[this.layer].resetTime).max(1).log10().pow(new Decimal(0.8).add(x.mul(0.2)).max(1)).mul(x).add(1) },
            display() { return `Increases grass based on time since last level reset
                                Amount: ${getBuyableAmount(this.layer, this.id)}/10
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("cs", 0)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(10)
        },
        14: {
            title: "Range",
            tooltip: "log10(grass)^(x/2)",
            cost(x) { return new Decimal(10).pow(x).mul(10000).floor() },
            effect(x) { 
		    return player.points.max(1).log10().pow(x.mul(0.5)).max(1)
	    },
            display() { return `Increases grass based on grass
                                Amount: ${getBuyableAmount(this.layer, this.id)}/5
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("cs", 0)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5)
        },
        21: {
            title: "PP",
            cost(x) { return new Decimal(2).pow(x).mul(5000).floor() },
            effect(x) { return new Decimal(0.1).mul(x).add(1).mul(new Decimal(1.25).pow(x.div(25).floor())) },
            display() { return `Increases prestige poitns gained by 10%
                                Increases by 25% every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/200
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("cs", 0)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return player[this.layer].points.gte(25)||player["pp"].total.gt(0) },
            purchaseLimit: new Decimal(200)
        },
    }
})
addLayer("pk", {
    name: "pk", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "pk", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0066ff",
    resource: "total perks", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player["lv"].points.gte(2)},
    effectDescription() { return `${player["pk"].total} unspent perks`},
    automate() { 
        pPerLvl = new Decimal(1)
        if (hasUpgrade("pp", "11")) { pPerLvl = pPerLvl.add(1) }
        if (player[this.layer].points.lt(player["lv"].points.sub(1).mul(pPerLvl))){
            player[this.layer].points = player[this.layer].points.add(1)
            player[this.layer].total = player[this.layer].total.add(1)
        }
    },
    doReset(resetLayer) {
        keep = []
        if (player[resetLayer].row.gte(1)) {
            if (!(resetLayer == "pp" && hasMilestone("cs",1))) {
                layerDataReset("pk",[])
        }}
    },
    buyables: {
        11: {
            title: "Value perk",
            cost(x) { return new Decimal(1) },
            effect(x) { return new Decimal(1).add(player["lv"].points.mul(x).mul(0.1)) },
            display() { return `Increases grass gained by 10% times your level
                                Amount: ${getBuyableAmount(this.layer, this.id)}/100
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost()} perks` },
            canAfford() { return player[this.layer].total.gte(this.cost()) },
            buy() {
                player[this.layer].total = player[this.layer].total.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(100)
        },
        21: {
            title: "Prestige perk",
            cost(x) { return new Decimal(1) },
            effect(x) { return new Decimal(1).add(player["ti"].points.mul(x).mul(0.1)) },
            display() { return `Increases prestige points gained by 10% times your tier
                                Amount: ${getBuyableAmount(this.layer, this.id)}/100
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost()} perks` },
            canAfford() { return player[this.layer].total.gte(this.cost()) },
            unlocked() { return player["pp"].total.gte(1) },
            buy() {
                player[this.layer].total = player[this.layer].total.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(100)
        }
    }
})
addLayer("ti", {
    name: "ti", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ti", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	    points: new Decimal(1),
        platinum: new Decimal(0)
    }},
    effectDescription() { return `you also have ${player[this.layer].platinum.floor()} platinum`},
    color: "#ffff00",
    resource: "tier", // Name of prestige currency
    baseResource: "grass",
    baseAmount() { return player.points },
    exponent: 1.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("ti",11))
        return mult
    },
    requires: new Decimal(1000),
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player["pp"].total.gte(1)},
    doReset(resetLayer) {
        if (player[resetLayer].row.gte(2)) {
            layerDataReset("ti",["platinum","buyables"])
        }
    },
    update(diff) {
        if (player[this.layer].unlocked){
        player[this.layer].platinum = player[this.layer].platinum.add(new Decimal(0.01).mul(diff))
        }
    },
    automate() {},
    /*upgrades: {
        11: {
            title: "That was"
        }
    },*/
    buyables: {
        11: {
            title: "Platinum tier",
            cost(x) { return new Decimal(5).pow(x)},
            effect(x) { return new Decimal(1).mul(new Decimal(0.9).pow(x)) },
            display() { return `Decreases tier requirement by 10% multiplicative
                                Amount: ${getBuyableAmount(this.layer, this.id)}/10
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost()} platinum` },
            canAfford() { return player[this.layer].platinum.gte(this.cost()) },
            buy () {
                player[this.layer].platinum = player[this.layer].platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    }
})
addLayer("pp", {
    name: "pp", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8cd3ff",
    requires: new Decimal(30), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "levels", // Name of resource prestige is based on
    baseAmount() {return player["lv"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("lv",21))
        mult = mult.mul(buyableEffect("pk",21))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    milestones: {
        0: {
            requirementDescription: "1 total prestige points",
            effectDescription: "You can now buy max level",
            done() { return player["pp"].total.gte(1) }
        },
        1: {
            requirementDescription: "10 total prestige points",
            effectDescription: "Grass upgrades no longer take away grass",
            done() { return player["pp"].total.gte(10) }
        }
    },
    upgrades: {
        11: {
            title: "More perks",
            description: "Increases perks earned by 1",
            cost: new Decimal(10),

        }
    },
    buyables: {
        11: {
            title: "Prestige grass",
            cost(x) { return new Decimal(4).pow(x).mul(5).floor() },
            effect(x) { return new Decimal(1).add(x.mul(0.5)).mul(new Decimal(2).pow(x.div(25).floor())) },
            display() { return `Increases grass gained by 50%
                                Doubles effect every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/250
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} prestige points` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(250)
        },
        12: {
            title: "Prestige XP",
            cost(x) { return new Decimal(4).pow(x).mul(5).floor() },
            effect(x) { return new Decimal(1).sub(x.div(100)).mul( new Decimal(1).sub(0.05).pow(x.div(25).floor())) },
            display() { return `Decreases level requirement by 1%
                                Decreases by 5% (multiplicative) every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/50
                                Effect: ${buyableEffect(this.layer, this.id).mul(100).floor().div(100)}x
                                Cost: ${this.cost().ceil()} prestige points` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()) 
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(50)
        },
    }
})
addLayer("cs", {
    name: "cs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CS", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff00ff",
    requires: new Decimal(3), // Can be a function that takes requirement increases into account
    resource: "crystals", // Name of prestige currency
    baseResource: "tier", // Name of resource prestige is based on
    baseAmount() {return player["ti"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player["pp"].unlocked},
    milestones: {
        0: {
            requirementDescription: "1 total crystals",
            effectDescription: "Grass upgrades no longer take away grass",
            done() { return player["cs"].total.gte(1) }
        },
        1: {
            requirementDescription: "10 total crystals",
            effectDescription: "Perks no longer reset on prestige",
            done() { return player["cs"].total.gte(10) }
        }
    },
    buyables: {
        
    }
})