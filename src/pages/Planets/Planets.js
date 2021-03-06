import { useState, useEffect, useRef } from 'react';
import useFetch from '../../components/hooks/useFetch';
// For animations
import { motion } from 'framer-motion';
import { gsap } from "gsap";
// Import the Cards
import Card from '../../components/Cards/PlanetsCard';
// Images
import yellowStar from '../../assets/images/yellowPlanet.png';
import blueStar from '../../assets/images/bluePlanet.png';
import jupiter from '../../assets/videos/jupiter.mp4';
// Get general styling
import {
    Section, Overlay, Pane, MainSection, ButtonSection, ListSection,
    Header, Input, Select, HomeLink, RightShort
} from '../sharedStyling';
import { YellowPlanet, YellowImg, BluePlanet, BlueImg, JupiterVid } from './planets-style';

const Planets = () => {
    // info for our custom hook- There are 61 planets in the api
    const { data: planets } = useFetch(`https://swapi.py4e.com/api/planets/`, 61);
    // animations
    const yellowRef = useRef(null);
    const blueRef = useRef(null);
    // state
    const [searchTerm, setSearchTerm] = useState('');
    const [sorted, setSorted] = useState('');
    const [offsetY, setOffsetY] = useState(0);

    // handle parallax effect
    const handleScroll = () => setOffsetY(window.pageYOffset);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /** Gsap animations for the planets **/
    useEffect(() => {
        gsap.fromTo(yellowRef.current, 1.7, {
            x: "50vw",
            scale: .2,
            opacity: .3
        }, {
            x: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out"
        }, 1);
    }, [])
    useEffect(() => {
        gsap.fromTo(blueRef.current, 2, {
            y: "20vh",
            scale: .2,
            opacity: .3
        }, {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out"
        }, .7);
    }, [])

    // set the current state of the items
    const handleSort = (e) => {
        setSorted(e.target.value)
    };

    // sort according to the correct buttonClick.
    // if letter a is before letter b... and vice versa
    // in the second statement
    planets.sort((a, b) => {
        if (sorted === "from-A") {
            return (a.name > b.name)
                ? 1 : ((a.name < b.name)
                    ? -1 : 0);
        } else if (sorted === "from-Z") {
            return (a.name < b.name)
                ? 1 : ((a.name > b.name)
                    ? -1 : 0);
        }
        else {
            return true
        }
    });

    return (
        <Section >
            {/** Background planets 
             * The transfom handles the speed in the y-direction 
             * of the item when scrolling **/}
            <YellowPlanet ref={yellowRef} style={{
                transform: `translateY(${offsetY * 0.8}px)`
            }}>
                <YellowImg src={yellowStar} alt="img of yellow planet" />
            </YellowPlanet>
            <BluePlanet ref={blueRef} style={{
                transform: `translateY(${offsetY * -0.3}px)`
            }}>
                <BlueImg src={blueStar} alt="img of blue planet" />
            </BluePlanet>
            <JupiterVid autoPlay loop muted style={{
                transform: `translateY(${offsetY * 0.1}px)`
            }}>
                <source src={jupiter} type="video/mp4" alt="video of Jupiter" />
            </JupiterVid>
            {/** Using the overlay to "reset" positioning
             * and z-index after using position absolute for the planets
             **/}
            <Overlay as={motion.div}
                initial={{ scaleX: 0, x: "60vw" }}
                animate={{ scaleX: 1, x: "0" }}
                exit={{ scaleX: 0, x: "60vw" }}
                transition={{ duration: 0.5 }}>
                <Pane />
                <MainSection>
                    <Header>Planets</Header>
                    <ButtonSection>
                        {/** In search, pass the key pressed as targe value */}
                        <Input
                            type="text"
                            placeholder="Search Planet..."
                            onChange={(event) => {
                                setSearchTerm(event.target.value)
                            }}
                        />
                        <Select defaultValue="Sort" onChange={(e) => { handleSort(e) }}>
                            <option disabled value="Sort" >Sort</option>
                            <option value="from-A">Name A-Z</option>
                            <option value="from-Z">Name Z-A</option>
                        </Select>
                    </ButtonSection>
                    <HomeLink to="/">Get Back Home<RightShort /></HomeLink>
                    <ListSection >
                        {/** filter the items, from the search. Make all
                         * letters to lowercase to avoid any problem if
                         * user is using small or caps letters.
                         */}
                        {planets.filter(item => {
                            if (searchTerm === "") {
                                return item
                            } else if (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return item
                            }
                            else {
                                return false
                            }
                        }).map((item, index) => {
                            return (
                                <Card key={index} {...item} />
                            )
                        })}
                    </ListSection>
                </MainSection>
                <Pane />
            </Overlay>
        </Section>
    )
}

export default Planets
