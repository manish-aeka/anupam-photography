<script>
  export let category;
  export let index;

  const isEven = index % 2 === 0;
</script>

<div
  data-aos={isEven ? "fade-right" : "fade-left"}
  data-aos-delay={index * 150}
  class="w-full max-w-7xl mx-auto my-6 sm:my-8 md:my-10 px-4 sm:px-6"
>
  <div class="flex flex-col {isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6 sm:gap-8 md:gap-10">

    <!-- IMAGE -->
    <div class="w-full md:w-1/2">
      <div 
        data-aos="zoom-in"
        data-aos-delay={index * 200}
        class="overflow-hidden p-1"
      >
        <img
          src={category.image}
          alt={category.title}
          class="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-md
                 transition-all duration-1000 ease-out 
                 hover:scale-105"
        />
      </div>
    </div>

    <!-- TEXT -->
    <div
      data-aos="fade-up"
      data-aos-delay={index * 250}
      class="w-full md:w-1/2 text-center md:text-left"
    >
      <h3 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white font-serif">
        {category.title}
      </h3>

      <p class="text-gray-300 text-base xs:text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed font-light">
        {category.description}
      </p>

      <button 
        class="px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3 
               bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl 
               hover:scale-105 transition-all duration-300 shadow-lg
               text-sm xs:text-base sm:text-lg"
      >
        Explore {category.title} →
      </button>
    </div>

  </div>
</div>