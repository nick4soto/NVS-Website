document.addEventListener('DOMContentLoaded', function() {
    const logoContainers = document.querySelectorAll('.logos-slide');

    logoContainers.forEach(container => {
        const logos = container.innerHTML;
        container.innerHTML = logos.repeat(1000); 
        
        const logoWidth = container.querySelector('img').offsetWidth + 100;
        const totalLogos = container.querySelectorAll('img').length;
        const containerWidth = logoWidth * totalLogos / 2;
        
        container.style.width = `${containerWidth}px`;

        let position = 0;
        const speed = 1;
        let animationId;

        function animate() {
            position -= speed;

            if (position <= -containerWidth / 2) {
                position = 0;
            }

            container.style.transform = `translateX(${position}px)`;

            animationId = requestAnimationFrame(animate);
        }

        animate();

        container.parentElement.addEventListener('mouseover', function() {
            cancelAnimationFrame(animationId);
        });

        container.parentElement.addEventListener('mouseout', function() {
            animationId = requestAnimationFrame(animate);
        });
    });
});