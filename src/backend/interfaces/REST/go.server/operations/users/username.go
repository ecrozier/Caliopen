// Copyleft (ɔ) 2017 The Caliopen contributors.
// Use of this source code is governed by a GNU AFFERO GENERAL PUBLIC
// license (AGPL) that can be found in the LICENSE file.

package users

import (
	obj "github.com/CaliOpen/Caliopen/src/backend/defs/go-objects"
	"github.com/CaliOpen/Caliopen/src/backend/main/go.main"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GET …/users/isAvailable
func IsAvailable(ctx *gin.Context) {
	username := ctx.Query("username")
	if username == "" {
		ctx.JSON(http.StatusBadRequest, obj.Availability{false, username})
		return
	}

	available, err := caliopen.Facilities.RESTfacility.UsernameIsAvailable(username)

	if available && err == nil {
		ctx.JSON(http.StatusOK, obj.Availability{true, username})
		return
	}
	ctx.JSON(http.StatusOK, obj.Availability{false, username})
}
