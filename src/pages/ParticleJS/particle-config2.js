const particlesConfig = {
    background: {
        color: {
            value: "#010214",
        },
    },
    fpsLimit: 120,
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble"
            },
            onclick: {
                enable: true,
                mode: "repulse"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 443.5564435564435,
                size: 0,
                duration: 2,
                opacity: 0,
                speed: 3
            },
            repulse: {
                distance: 400,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    particles: {
        color: {
            value: "#ffffff"
        },
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0,
            width: 0,
        },
        collisions: {
            enable: true,
        },
        move: {
            enable: true,
            speed: 1,
            direction: "top-right",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 600
            }
        },
        number: {
            value: 160,
            density: {
                enable: true,
                value_area: 800
            }
        },
        opacity: {
            value: 1,
            random: true,
            anim: {
                enable: true,
                speed: 1.6230472712517763,
                opacity_min: 0.08115236356258881,
                sync: false
            }
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 4,
                size_min: 0.3,
                sync: false
            }
        },
        line_linked: {
            enable: false,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
    },
    detectRetina: true,
};
