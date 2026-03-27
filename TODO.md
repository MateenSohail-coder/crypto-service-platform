  # Cloudinary Image Upload Integration TODO

1. ✅ **Install Cloudinary dependency** `cd crypto-service-platform && pnpm add cloudinary`
2. ✅ **Update .env.local** - Add Cloudinary environment variables
3. ✅ **Replace lib/uploadImage.js** - Implement Cloudinary upload/download functions
4. ✅ **Update models/Service.js** - Replace image field with imageUrl/imagePublicId
5. ✅ **Update models/Article.js** - Replace coverImage with coverImageUrl/coverImagePublicId
6. ✅ **Update api/services/route.js** - Modify create/delete to use new fields/functions
7. ✅ **Update api/articles/route.js** - Modify create/delete to use new fields/functions
8. **Test create service** via admin panel
9. **Test create article** via admin panel  
10. **Test delete service/article** - verify Cloudinary cleanup
11. **Verify frontend display** - image URLs work seamlessly
12. **Mark complete**
