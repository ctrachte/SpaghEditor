//Call plugins utensils
//Core class which plugins don't directly alter
class chef
{
    constructor(options)
    {
        this.pluginsArr = options.plugins || [];
        this.plugins;

        this.initChef();
    }

    initChef()
    {
        let pluginNamesArr = [];
        this.pluginsArr.forEach(plugin => 
        {
            //Adds/replaces properties in basePlugin with those in plugins
            pluginNamesArr.push(Object.keys(plugin)[0]);
            Object.assign(basePlugin.prototype, plugin[Object.keys(plugin)[0]]);
        });

        this.plugins = new basePlugin();

        pluginNamesArr.forEach((pluginName) =>
        {
            //execute plugin inits
            this.plugins[pluginName]();
        });
    }    

    addPlugin(cls)
    {
        this.pluginsArr.push(cls);
        this.initChef();
    }
}

//Methods
class basePlugin
{
    constructor()
    {
        console.log("I'm the basePlugin constructor and can't be changed");
    }

    initialize()
    {
    }

    generic()
    {
        console.log('base');
    }
}

let one = 
{
    one()
    {
        console.log('one');
    },
    generic()
    {
        console.log('one');
    }
};

let two =
{
    two()
    {
        console.log('two');
    },
    generic()
    {
        console.log('two');
    }
};

let three =
{
    three()
    {
        console.log('three');
    },
    generic()
    {
        console.log('three');
    }
}

let four =
{
    four()
    {
        console.log('four');
    },
    fourSpecial()
    {
        console.log("I'm plugin number 4");
    }
}

let spag = new chef(
    {
        plugins: [{'four': four},{'one': one}, {'three': three}, {'two': two}]
    });

spag.plugins.fourSpecial();

spag.plugins.generic(); //Override demo