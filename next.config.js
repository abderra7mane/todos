module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/signin',
        permanent: true
      }
    ]
  }
}