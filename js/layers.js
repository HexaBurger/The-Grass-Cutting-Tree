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
    exponent: 0.8, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("lv",12))
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
    automate() {
        if (canReset("lv") && hasMilestone("pp", 0)) { doReset("lv") }
    },
    /*upgrades: {
        11: {
            title: "That was"
        }
    },*/
    buyables: {
        11: {
            title: "Grass value",
            cost(x) { return new Decimal(2).pow(x).mul(10).floor() },
            effect(x) { return new Decimal(x.add(1)).mul(new Decimal(2).pow(x.div(25).floor())) },
            display() { return `Increases grass gained by 100%
                                Doubles effect every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/250
                                Effect: ${buyableEffect(this.layer, this.id).floor()}x
                                Cost: ${this.cost()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("pp", 1)) { player.points = player.points.sub(this.cost()) }
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
                                Effect: ${buyableEffect(this.layer, this.id)}x
                                Cost: ${this.cost()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("pp", 1)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(75)
        },
        13: {
            title: "Speed",
            tooltip: "1+log10(time)*x",
            cost(x) { return new Decimal(10).pow(x).mul(1000).floor() },
            effect(x) { return new Decimal(player[this.layer].resetTime).log10().mul(x).add(1) },
            display() { return `Increases grass based on time since last level reset
                                Amount: ${getBuyableAmount(this.layer, this.id)}/10
                                Effect: ${buyableEffect(this.layer, this.id).floor()}x
                                Cost: ${this.cost()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("pp", 1)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(10)
        },
        14: {
            title: "Range",
            tooltip: "1+log10(grass)^0.75*x",
            cost(x) { return new Decimal(10).pow(x).mul(10000).floor() },
            effect(x) { return new Decimal(1).mul(player.points).log10().pow(0.75).mul(x).add(1) },
            display() { return `Increases grass based on grass
                                Amount: ${getBuyableAmount(this.layer, this.id)}/10
                                Effect: ${buyableEffect(this.layer, this.id).floor()}x
                                Cost: ${this.cost()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("pp", 1)) { player.points = player.points.sub(this.cost()) }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(10)
        },
        21: {
            title: "PP",
            cost(x) { return new Decimal(2).pow(x).mul(5000).floor() },
            effect(x) { return new Decimal(x.mul(0.1).add(1)).mul(new Decimal(1.25).pow(x.div(25).floor())) },
            display() { return `Increases prestige poitns gained by 10%
                                Increases by 25% every 25
                                Amount: ${getBuyableAmount(this.layer, this.id)}/200
                                Effect: ${buyableEffect(this.layer, this.id)}x
                                Cost: ${this.cost()} grass` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                if (!hasMilestone("pp", 1)) { player.points = player.points.sub(this.cost()) }
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
        if (player[this.layer].points.lt(player["lv"].points.sub(1).mul(1))){
            player[this.layer].points = player[this.layer].points.add(1)
            player[this.layer].total = player[this.layer].total.add(1)
        }
    },
    buyables: {
        11: {
            title: "Value perk",
            cost(x) { return new Decimal(1) },
            effect(x) { return new Decimal(1).add(player["lv"].points.mul(x.mul(0.1))) },
            display() { return `Increases grass gained by 10% times your level
                                Amount: ${getBuyableAmount(this.layer, this.id)}/100
                                Effect: ${buyableEffect(this.layer, this.id)}x
                                Cost: ${this.cost()} perks` },
            canAfford() { return player[this.layer].total.gte(this.cost()) },
            buy() {
                player[this.layer].total = player[this.layer].total.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(100)
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
            effectDescription: "Unlock level autobuyer",
            toggles: [["lv","autoLevel"]],
            done() { return player["pp"].total.gte(1) }
        },
        1: {
            requirementDescription: "10 total prestige points",
            effectDescription: "Grass upgrades no longer take away grass",
            done() { return player["pp"].total.gte(10) }
        }
    },
    buyables: {
        
    }
})