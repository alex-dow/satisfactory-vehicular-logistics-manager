<template>
  <span class="loader !text-orange-400"></span>
</template>

<style>
.loader {
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 50%;
  color: #ff3d00;
  animation: fill 1s ease-in infinite alternate;
}
.loader::before,
.loader::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  left: 24px;
  top: 0;
  animation: fill 0.9s ease-in infinite alternate;
}

.loader::after {
  left: auto;
  right: 24px;
  animation-duration: 1.1s;
}

@keyframes fill {
  0% {
    box-shadow: 0 0 0 2px inset;
  }
  100% {
    box-shadow: 0 0 0 4px inset;
  }
}
</style>
