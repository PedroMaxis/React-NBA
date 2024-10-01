module.exports = 
   {
      // Note: config only includes the used styles & variables of your selection
      content: ["./src/**/*.{html,vue,svelte,js,jsx,tsx}"],
      theme: {
        extend: {
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0', filter: 'blur(100%)', transform: 'translateX(-100%)' },
              '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateX(0)' },
            }
          },
          animation: {
            fadeIn: 'fadeIn 1000s ease-in-out',
          },
          fontFamily: {
            
          },
          fontSize: {
            
          },
          fontWeight: {
            
          },
          lineHeight: {
             
          },
          letterSpacing: {
             
          },
          borderRadius: {
              
          },
          colors: {
            
            
          },
          spacing: {
              
          },
          width: {
             
          },
          minWidth: {
             
          },
          maxWidth: {
             
          },
          height: {
             
          },
          minHeight: {
             
          },
          maxHeight: {
             
          }
        }
      }
    }

            