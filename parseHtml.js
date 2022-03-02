/** Parses HTML from String to an array of clsNoodle **/
function parseHtmlIn(html)
{
    let parser = new DOMParser();
    let htmlDoc;
    let docBody;

    if(typeof html === 'string')
    {
        htmlDoc = parser.parseFromString(html,"text/html");
        docBody = htmlDoc.body;
    }
    else if (typeof html === 'object')
    {
        docBody = html;
    }
    else
    {
        console.error('unexpected type');
    }

    let nodesArr = [];

    docBody.childNodes.forEach((nd) => 
    {
        // nd.nodeType
        // 1 - element node
        // 2 - attribute node
        // 3 - text node
        // 8 - comment node

        let noodle = new clsNoodle();

        switch(nd.nodeType)
        {
            case 1: //element node
                if(nd.hasChildNodes()) //Multiple elements
                {
                    if(nd.childNodes.length == 1 && nd.childNodes[0].nodeType === 3) //Node with text
                    {
                        noodle.elementType = nd.nodeName.toString();
                        noodle.value = nd.childNodes[0].textContent;

                        if(nd.attributes.length > 0)
                        {
                            for(let i=0; i < nd.attributes.length; i++)
                            {
                                noodle.attributes.push({name: nd.attributes[i].name, value: nd.attributes[i].value});
                            }
                        }

                        nodesArr.push(noodle);
                    }
                    else if(nd.childNodes.length > 1)
                    {
                        noodle.elementType = nd.nodeName.toString();
                        noodle.value = '';

                        if(nd.attributes.length > 0)
                        {
                            for(let i=0; i < nd.attributes.length; i++)
                            {
                                noodle.attributes.push({name: nd.attributes[i].name, value: nd.attributes[i].value});
                            }
                        }

                        noodle.subElements.push(parseHtmlIn(nd));

                        nodesArr.push(noodle);
                    }                        
                }
                else //Single Element
                {
                    noodle.elementType = nd.nodeName.toString();
                    noodle.value = '';
                    if(noodle.elementType === 'IMG')
                    {
                        let img = getImg64bitString(nd.getAttribute('src'));
                        noodle.value = img;
                    }
                    if(nd.attributes.length > 0)
                    {
                        for(let i=0; i < nd.attributes.length; i++)
                        {
                            switch(nd.attributes[i].name)
                            {
                                case 'selected':
                                case 'checked':
                                case 'disabled':
                                case 'readonly':
                                    //If attribute disabled/readonly has defined value add to array with existing value
                                    if(typeof nd.attributes[i].value !== 'undefined' && nd.attributes[i].value.length > 0)
                                    {
                                        noodle.attributes.push({name: nd.attributes[i].name, value: nd.attributes[i].value});
                                    }
                                    //If value does not exist for disabled/readonly add to array with true
                                    else
                                    {
                                        noodle.attributes.push({name: nd.attributes[i].name, value: true});
                                    }
                                    break;
                                case 'src':
                                    if(noodle.elementType === 'img' && noodle.getAttribute('src').length > 0)
                                    {
                                        noodle.attributes.push({name: 'origsrc', value: nd.attributes[i].value});
                                    }
                                    break;
                                default: 
                                    //If value exists add to array
                                    if(nd.attributes[i].value && nd.attributes[i].value.length > 0)
                                    {
                                        noodle.attributes.push({name: nd.attributes[i].name, value: nd.attributes[i].value});
                                    }
                                    else {} //If no value exists do not add to array
                            }
                        }
                    }
                    nodesArr.push(noodle);
                }
                break;
            case 2: //attribute node
                console.error('attribute node')
                break;
            case 3: //text node
                noodle.elementType = 'P';
                noodle.value = nd.textContent;
                nodesArr.push(noodle);
                break;
            case 8: //comment node
                noodle.elementType = 'comment';
                noodle.value = nd.textContent;
                nodesArr.push(noodle);
                break;
            default: //Unhandled
                console.error('Not handled')
        }
    });

    return nodesArr;
}

function getImg64bitString(imgPath)
{
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgPath;
    //img.onload = () => { return ready};

    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext('2d');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);

    return setTimeout(() => 
    {
        return canvas.toDataURL();
    }, 500);
}

/** Parses array of clsNoodle to HTML Elements **/
function parseHtmlOut(obj)
{
    let newHtml = document.createElement('div');
    if(typeof obj === 'object')
    {
        if(obj.length > 1)
        {
            obj.forEach((noodle) => 
            {
                let newEl = document.createElement(noodle.elementType.toString());
                
                if(noodle.attributes.length > 0)
                {
                    noodle.attributes.forEach((attribute) => 
                    {
                        newEl.setAttribute(attribute.name, attribute.value);
                    });
                }

                if(noodle.elementType.toString() === 'IMG')
                {
                    console.log(noodle.value);
                    newEl.src = noodle.value;
                }
                else
                {
                    newEl.innerText = noodle.value;
                }

                if(noodle.subElements.length > 0)
                {
                    noodle.subElements.forEach((subEl) =>
                    {
                        let children = parseHtmlOut(subEl);
                        children = children.childNodes; //Delivered back in DIV but we don't need that

                        children.forEach((node) =>
                        {
                            newEl.appendChild(node);
                        });
                    });
                }

                newHtml.appendChild(newEl);
            });
        }
        else
        {
            console.error('single object or other issue');
        }
    }
    else
    {
        console.error('Type not handled');
    }

    return newHtml;
}

/**
 * Class representation of lines/blocks of data in document
 * this.elementType {string} - represents the type of container for this line of data
 * this.value {string} - innertext or string value of line of data/block. 64bit encoded images, etc
 * this.attributes {object[]} - array of attributes and values
 * this.subElements {object[]} - array of clsNoodle instances that make up child nodes of parent clsNoodle instance
 */
class clsNoodle
{
    constructor()
    {
        this.elementType = '';
        this.value = ''; //strings, 64bit encoded string for images
        this.attributes = []; //All attributes here. If empty discard. 
        this.subElements = []; //array of boiler
    }
}

    let testText = `<img src="./img/swedishchef.jpg">
The Egg
# SpaghEditor
## SpaghEditor
### SpaghEditor
#### d
##### dd
###### d
By: Andy Weir

dsfa<br>dfsfads
dfdsf<br />fdsfds
dsfdsf<br / >fdsfads

<p someAttribute1="val1" someAttribute2="val2">Attribute Test </p>

The quick brown <p>fox jumps over</p> the lazy dog

<div>
You were on your way home when you died.

It was a car accident. Nothing particularly remarkable, but fatal nonetheless. You left behind a wife and two children. It was a painless death. The EMTs tried their best to save you, but to no avail. Your body was so utterly shattered you were better off, trust me.

And that’s when you met me.

<p>“What… what happened?” <strong>You asked</strong>. “Where am I?”</p>

“You died,” I said, matter-of-factly. No point in mincing words.

“There was a… a truck and it was skidding…”

“Yup,” I said.

“I… I died?”
</div>
“Yup. But don’t feel bad about it. Everyone dies,” I said.

You looked around. There was nothingness. Just you and me. “What is this place?” You asked. “Is this the afterlife?”

“More or less,” I said.

“Are you god?” You asked.

“Yup,” I replied. “I’m God.”

“My kids… my wife,” you said.

“What about them?”

<p>“Will they be all right?”</p>

<h1>“That’s what I like to see,” I said. “You just died and your main concern is for your family. That’s good stuff right there.”</h1>

You looked at me with fascination. To you, I didn’t look like God. I just looked like some man. Or possibly a woman. Some vague authority figure, maybe. More of a grammar school teacher than the almighty.

“Don’t worry,” I said. “They’ll be fine. Your kids will remember you as perfect in every way. They didn’t have time to grow contempt for you. Your wife will cry on the outside, but will be secretly relieved. To be fair, your marriage was falling apart. If it’s any consolation, she’ll feel very guilty for feeling relieved.”

<span>“Oh,” you said. “So what happens now? Do I go to heaven or hell or something?”</span>

“Neither,” I said. “You’ll be reincarnated.”

“Ah,” you said. “So the Hindus were right,”

“All religions are right in their own way,” I said. “Walk with me.”

You followed along as we strode through the void. “Where are we going?”

“Nowhere in particular,” I said. “It’s just nice to walk while we talk.”

“So what’s the point, then?” You asked. “When I get reborn, I’ll just be a blank slate, right? A baby. So all my experiences and everything I did in this life won’t matter.”

“Not so!” I said. “You have within you all the knowledge and experiences of all your past lives. You just don’t remember them right now.”

<p value="bob">I stopped walking and took you by the shoulders. “Your soul is more magnificent, beautiful, and gigantic than you can possibly imagine. A human mind can only contain a tiny fraction of what you are. It’s like sticking your finger in a glass of water to see if it’s hot or cold. You put a tiny part of yourself into the vessel, and when you bring it back out, you’ve gained all the experiences it had.</p>

“You’ve been in a human for the last 48 years, so you haven’t stretched out yet and felt the rest of your immense consciousness. If we hung out here for long enough, you’d start remembering everything. But there’s no point to doing that between each life.”

“How many times have I been reincarnated, then?”

“Oh lots. Lots and lots. An in to lots of different lives.” I said. “This time around, you’ll be a Chinese peasant girl in 540 AD.”

“Wait, what?” You stammered. “You’re sending me back in time?”

“Well, I guess technically. Time, as you know it, only exists in your universe. Things are different where I come from.”

“Where you come from?” You said.

“Oh sure,” I explained “I come from somewhere. Somewhere else. And there are others like me. I know you’ll want to know what it’s like there, but honestly you wouldn’t understand.”

“Oh,” you said, a little let down. “But wait. If I get reincarnated to other places in time, I could have interacted with myself at some point.”

“Sure. Happens all the time. And with both lives only aware of their own lifespan you don’t even know it’s happening.”

“So what’s the point of it all?”

“Seriously?” I asked. “Seriously? You’re asking me for the meaning of life? Isn’t that a little stereotypical?”

“Well it’s a reasonable question,” you persisted.

I looked you in the eye. “The meaning of life, the reason I made this whole universe, is for you to mature.”

“You mean mankind? You want us to mature?”

“No, just you. I made this whole universe for you. With each new life you grow and mature and become a larger and greater intellect.”

“Just me? What about everyone else?”

“There is no one else,” I said. “In this universe, there’s just you and me.”

You stared blankly at me. “But all the people on earth…”

“All you. Different incarnations of you.”

“Wait. I’m everyone!?”

“Now you’re getting it,” I said, with a congratulatory slap on the back.

“I’m every human being who ever lived?”

“Or who will ever live, yes.”

“I’m Abraham Lincoln?”

“And you’re John Wilkes Booth, too,” I added.

“I’m Hitler?” You said, appalled.

“And you’re the millions he killed.”

“I’m Jesus?”

“And you’re everyone who followed him.”

You fell silent.

“Every time you victimized someone,” I said, “you were victimizing yourself. Every act of kindness you’ve done, you’ve done to yourself. Every happy and sad moment ever experienced by any human was, or will be, experienced by you.”

You thought for a long time.

“Why?” You asked me. “Why do all this?”

“Because someday, you will become like me. Because that’s what you are. You’re one of my kind. You’re my child.”

“Whoa,” you said, incredulous. “You mean I’m a god?”

“No. Not yet. You’re a fetus. You’re still growing. Once you’ve lived every human life throughout all time, you will have grown enough to be born.”

“So the whole universe,” you said, “it’s just…”

<!--“An egg.” <span>I answered.</span> “Now it’s time for you to move on to your next life.”-->

And I sent you on your way.`;

    let noodleObj = parseHtmlIn(testText);
    console.log(noodleObj);

    let htmlObj = parseHtmlOut(noodleObj);
    console.log(htmlObj);

    document.body.append(htmlObj)