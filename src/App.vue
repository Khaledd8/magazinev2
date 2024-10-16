<template>
  <div class="card card-custom gutter-b">
    <div class="card-header">
      <div class="card-title">
        <h3 class="card-label">
				Basic Card
				<small>sub title</small>
			</h3>
      </div>
    </div>
    <div class="card-body">
  <div class="magazine-container">

    <div class="magazine-content">
      <div id="flipbook" class="flipbook">
        <div class="hard cover-front"> 
          <div class="cover-content">
            <h2>Magazine Cover</h2>
            <p>Issue #1</p>
          </div>
        </div>
        <div class="hard"></div>
        <div v-for="(page, index) in pages" :key="index" class="page">
          <img :src="page" alt="PDF Page" />
        </div>
        <div class="hard"></div>
        <div class="hard cover-back"></div>
      </div>
    </div>
    <div class="magazine-controls">
      <button @click="prevPage" class="nav-button">❮ Previous</button>
      <span class="page-number">Page <span id="page-number"></span></span>
      <button @click="nextPage" class="nav-button">Next ❯</button>
    </div>    
  </div>  
  </div>
</div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; 
import "turn.js"; 
import $ from 'jquery'; 

export default {
  name: "MagazineViewer",
  data() {
    return {
      pdfFile: '/sample.pdf', 
      pages: [],
      flipbookInitialized: false,
    };
  },
  mounted() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.mjs';
    this.loadPdf();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument(this.pdfFile);
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          this.pages.push(canvas.toDataURL());
        }

        this.$nextTick(() => {
          this.initFlipbook();
        });
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    },
    initFlipbook() {
      const dimensions = this.getFlipbookDimensions();
      $("#flipbook").turn({
        width: dimensions.width,
        height: dimensions.height,
        autoCenter: true,
        display: this.isMobile() ? 'single' : 'double',
        acceleration: true,
        gradients: true,
        elevation: 50,
        when: {
          turning: (e, page) => {
            $('#page-number').text(page);
          }
        }
      });
      $('#page-number').text($("#flipbook").turn('page'));
      this.flipbookInitialized = true;
      this.handleResize();
    },
    handleResize() {
      if (!this.flipbookInitialized) return;
      
      const dimensions = this.getFlipbookDimensions();
      $("#flipbook").turn('size', dimensions.width, dimensions.height);
      $("#flipbook").turn('display', this.isMobile() ? 'single' : 'double');
    },
    getFlipbookDimensions() {
      const maxWidth = Math.min(window.innerWidth - 40, 1500);
      const maxHeight = window.innerHeight - 200; // Adjusted for header and controls
      
      let width = maxWidth;
      let height = width * 0.75; // Aspect ratio closer to a typical book

      if (height > maxHeight) {
        height = maxHeight;
        width = height / 0.75;
      }

      return { width, height };
    },
    isMobile() {
      return window.innerWidth < 768;
    },
    prevPage() {
      if (this.flipbookInitialized) {
        $("#flipbook").turn('previous');
      }
    },
    nextPage() {
      if (this.flipbookInitialized) {
        $("#flipbook").turn('next');
      }
    },
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  background-color: #f0f0f0;
}

.magazine-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.magazine-header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.magazine-header h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 1px;
}

.magazine-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 20px;
}

.flipbook {
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  border-radius: 5px;
  overflow: hidden; /* Hide overflowing pages */
}

.flipbook .page {
  background: #fff;
  border: none;
  background-image: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.05) 100%);
}

.flipbook .page img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the entire page */
}

.hard {
  background: #34495e;
  color: #ecf0f1;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-front, .cover-back {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.cover-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 20px;
}

.cover-content h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.cover-content p {
  font-size: 18px;
  opacity: 0.8;
}

.magazine-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.nav-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  border-radius: 5px;
  font-weight: bold;
}

.nav-button:hover {
  background-color: #2980b9;
}

.nav-button:active {
  transform: scale(0.98);
}

.page-number {
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .magazine-header h1 {
    font-size: 20px;
  }

  .magazine-footer {
    padding: 5px 10px;
  }

  .nav-button {
    padding: 8px 15px;
    font-size: 14px;
  }

  .page-number {
    font-size: 14px;
  }

  .cover-content h2 {
    font-size: 24px;
  }

  .cover-content p {
    font-size: 16px;
  }

  .flipbook {
    width: 100% !important; /* Ensure full width on mobile */
  }

  .flipbook .page img {
    object-fit: contain; /* Adjust image fitting for mobile */
  }
}
</style>
