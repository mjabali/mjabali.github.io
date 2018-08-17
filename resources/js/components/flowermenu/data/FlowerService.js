/**
 * Oracle Intelligent Bots Advanced Training
 * 
 * Class that simulates flower data queried from a remote service. 
 * This class needs to be changed if you wanted to query data from 
 * a real service (out of scope for the advanced training). 
 * 
 * @author Frank Nimphius, 2018
 */

var _bouquets;
var _flowers;

_flowers = [{
        title: "Daisies",
        description: "Send a touch of summer in bundles of 25 daisies",
        image: "/images/flowers/marguerite-729510__480.jpg",
        price: 1
    },
    {
        title: "Hyacinths",
        description: "Hyacinths are spring-blooming colored flowers with an incredible fragrance that can can perfume an entire home.",
        image: "/images/flowers/hyacinth-1403653__480.jpg",
        price: 2
    },
    {
        title: "Water lilies",
        description: "Water lilies are an unusual gift for exceptional people.",
        image: "/images/flowers/water-lily-3504112_960_720.jpg",
        price: 8
    },
    {
        title: "Roses",
        description: "Roses are not just beautiful flowers. The gesture of rose giving can often mean so much more.",
        image: "/images/flowers/rose-301406__480.jpg",
        price: 5
    },
    {
        title: "Sunflower",
        description: "Sunflowers are pure joy. Their colors and warmth create a light mood in every home.",
        image: "/images/flowers/arrangement-16858__480.jpg",
        price: 4
    },
    {
        title: "Poppies",
        description: "Poppies bring a natural touch of color to every home. They are like roses without a thorn",
        image: "/images/flowers/poppy-3521507__340.jpg",
        price: 1
    },
    {
        title: "Clove",
        description: "Carnations are colorful flowers that enchant a room with their fragrance. A gift for the senses.",
        image: "/images/flowers/cloves-1333629__480.jpg",
        price: 1
    }
];

_bouquets = [

    {
        title: "Bouquet of Roses",
        description: "A basket of roses, hand crafted and designed by a local florist",
        image: "/images/bouquets/rose-1405552__480.jpg",
        price: 35
    },
    {
        title: "Bouquet of 25 Tulips",
        description: "25 tulips brought together in an unforgettable arrangement only a local florist can do",
        image: "/images/bouquets/tulip-3515181__480.jpg",
        price: 35
    },
    {
        title: "Tulips in a Box Arrangement",
        description: "Valuable has always been stored in a box. Do the same with a gift of beautiful tulips",
        image: "/images/bouquets/bouquet-3158358__480.jpg",
        price: 40
    },
    {
        title: "Bouquet of Daisies",
        description: "The scent of the meadow bundled for a sweet home",
        image: "/images/bouquets/flowers-983897__480.jpg",
        price: 15
    },
    {
        title: "Bouquet for Proposal",
        description: "Just do not say it. Make her yours with this special arrangement",
        image: "/images/bouquets/love-1790142__480.jpg",
        price: 25
    },
    {
        title: "Wedding Bouquet",
        description: "The one time forever. Make the moment unforgettable",
        image: "/images/bouquets/flowers-3441662__480.jpg",
        price: 35
    },
    {
        title: "Colourful Bouquet",
        description: "The colors of joy bundled in an arrangement for friendship",
        image: "/images/bouquets/tulips-3373727__480.jpg",
        price: 25
    },
    {
        title: "Sunflowers Bouquet",
        description: "Why do you want to live with only one sun, if you can have more?",
        image: "/images/bouquets/sunflower-1622785__480.jpg",
        price: 45
    },
    {
        title: "Bouquet of Poppies",
        description: "An eye-catcher on every occasion",
        image: "/images/bouquets/poppies-1631682__480.jpg",
        price: 10
    },
    {
        title: "Dalia Bouquet",
        description: "Gentle and extraordinary looking for a new home",
        image: "/images/bouquets/dalia-2677514__480.jpg",
        price: 30
    },
    {
        title: "Wild Flowers Bouquet",
        description: "So natural and yet extraordinary. Send wildflowers",
        image: "/images/bouquets/flower-meadow-1448417__480.jpg",
        price: 25
    },
    {
        title: "Bridal Bouquet",
        description: "It is not for the day and not for the occasion. It's for her",
        image: "/images/bouquets/flower-393051__480.jpg",
        price: 40
    },
    {
        title: "Sweet Home Bouquet",
        description: "Home is where your heart is. Let them know",
        image: "/images/bouquets/tulips-2091612__480.jpg",
        price: 27
    },
    {
        title: "Birthday Bouquet",
        description: "Always like last year? No, not this year. Make it something special",
        image: "/images/bouquets/flowers-2051630__480.jpg",
        price: 30
    }
];

module.exports = {

    // return data array
    flowers: () => (_flowers),
    bouquets: () => (_bouquets)
};