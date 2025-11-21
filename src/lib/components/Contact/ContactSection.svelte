<script>
  // @ts-nocheck
  import { Instagram, Locate, Mail, MapPin, Phone } from 'lucide-svelte';
import { fly } from 'svelte/transition';

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const mailto = `mailto:anupam@gmail.com?subject=${encodeURIComponent(
      data.subject
    )}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;

    window.location.href = mailto;
  }
</script>

<section class="bg-[#10121A] py-20 px-4">
  <div class="md:max-w-7xl mx-auto">
    <h2 class="text-2xl md:text-5xl font-bold text-center text-indigo-400 mb-2" in:fly={{ y: 50 }}>
      Let's Connect @birds.series
    </h2>

    <p class="text-center text-gray-400 text-md md:text-xl mb-12">
      For inquiries into my nature photography, photography services, or availability, please use the form to contact me.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">

      <!-- CONTACT INFO -->
      <div class="flex flex-col gap-6">
        {#each [
          { title: 'Instagram', value: '@birds.series', link: 'https://instagram.com/birds.series' },
          { title: 'Email', value: 'anupam@gmail.com' },
          { title: 'Phone', value: '+91 1234567890' },
          { title: 'Location', value: 'Kolkata, India' }
        ] as item, i}
          <div class="flex items-center gap-4 bg-[#181A23] rounded-xl p-6" in:fly={{ y: 30, delay: i * 100 }}>
            {#if item.title==='Instagram'}
            <div class="bg-indigo-600 rounded-full p-4"><Instagram/></div>
             {:else if item.title==='Email'}
             <div class="bg-indigo-600 rounded-full p-4"><Mail/></div>
             {:else if item.title==='Phone'}
              <div class="bg-indigo-600 rounded-full p-4"><Phone/></div>
              {:else if item.title==="Location"}
               <div class="bg-indigo-600 rounded-full p-4"><MapPin /></div>
               {/if}
            <div>
              <div class="text-lg font-semibold text-white">{item.title}</div>

              {#if item.link}
                <a href={item.link} target="_blank" class="text-gray-400 hover:text-indigo-400">{item.value}</a>
              {:else}
                <div class="text-gray-400">{item.value}</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- CONTACT FORM -->
    <form on:submit={handleSubmit} class="bg-[#181A23] rounded-xl p-8 flex flex-col gap-6">

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-white font-semibold mb-1">Name</label>
      <input
        name="name"
        type="text"
        class="w-full rounded bg-[#10121A] text-white px-4 py-2 
               border border-gray-700
                focus:border-gray-500 focus:ring-2 focus:ring-gray-700 
               outline-none transition"
        placeholder="Your name"
        required
      />
    </div>

    <div>
      <label class="block text-white font-semibold mb-1">Email</label>
      <input
        name="email"
        type="email"
        class="w-full rounded bg-[#131417] text-white px-4 py-2 
               border border-gray-700
               focus:border-gray-500 focus:ring-2 focus:ring-gray-700 
               outline-none transition"
        placeholder="your@email.com"
        required
      />
    </div>
  </div>

  <div>
    <label class="block text-white font-semibold mb-1">Subject</label>
    <input
      name="subject"
      type="text"
      class="w-full rounded bg-[#10121A] text-white px-4 py-2 
             border border-gray-700
             focus:border-gray-500 focus:ring-2 focus:ring-gray-700 
             outline-none transition"
      placeholder="Photography inquiry"
      required
    />
  </div>

  <div>
    <label class="block text-white font-semibold mb-1">Message</label>
    <textarea
      name="message"
      rows="4"
      class="w-full rounded bg-[#10121A] text-white px-4 py-2 
             border border-gray-700
             focus:border-gray-500 focus:ring-2 focus:ring-gray-700 
             outline-none transition"
      placeholder="Tell me about your Photography..."
      required
    ></textarea>
  </div>

  <button
    type="submit"
    class="mt-2 w-full flex items-center justify-center gap-2 
           bg-indigo-500 hover:bg-indigo-600 text-white font-semibold 
           py-3 rounded-lg text-lg transition"
  >
    Get In Touch
  </button>

</form>


    </div>
  </div>
</section>
