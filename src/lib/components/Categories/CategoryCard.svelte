<script>
  export let category;
  export let index;

  
  const isEven = index % 2 === 0;
</script>

<div
  data-aos={isEven ? "fade-right" : "fade-left"}
  data-aos-delay={index * 150}
  class="w-full max-w-7xl mx-auto my-10"
>
  <div class="flex flex-col {isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10">

    <!-- IMAGE -->
    <div class="w-full md:w-1/2">
      <div 
        data-aos="zoom-in"
        data-aos-delay={index * 200}
        class="overflow-hidden  p-1"
      >
          <img
  src={category.image}
  alt={category.title}
  class="w-full h-[300px] md:h-[500px] object-cover rounded-md
         transition-all duration-1000 ease-out 
         hover:scale-105 "
/>
      </div>
    </div>

    <!-- TEXT -->
    <div
      data-aos="fade-up"
      data-aos-delay={index * 250}
      class="w-full md:w-1/2"
    >
      <h3 class="text-4xl md:text-5xl font-bold mb-6 text-white font-serif">
        {category.title}
      </h3>

      <p class="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed font-light">
        {category.description}
      </p>

      <button 
        class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl 
               hover:scale-105 transition-shadow shadow-lg"
      >
        Explore {category.title} →
      </button>
    </div>

  </div>
</div>
