using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    
   

    {

        private readonly ApContext _apContext;
        private readonly ITokenService _tokenService;
        public AuthController(ApContext apContext, ITokenService tokenService)
        {
            _apContext = apContext ?? throw new ArgumentNullException(nameof(apContext));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }
        //[HttpPost("login")]
        //public IActionResult Login([FromBody] LoginModel user)
        //{
        //    if (user is null)
        //    {
        //        return BadRequest("Invalid client request");
        //    }
        //    //if (user.UserName == "johndoe" && user.Password == "def@123")
        //    if (user.UserName == "test" && user.Password == "test")
        //    {

        //        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
        //        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        //        var tokeOptions = new JwtSecurityToken(
        //            issuer: "https://localhost:5001",
        //            audience: "https://localhost:5001",
        //            claims: new List<Claim>(),
        //            expires: DateTime.Now.AddMinutes(1),
        //            signingCredentials: signinCredentials
        //        );
        //        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        //        //  return Ok(new AuthenticatedResponse { Token = tokenString }, user)

        //        return Ok( new { firstName = user.UserName, lastName = user.Password,token = tokenString } );
        //    }
        //    return Unauthorized();
        //}

        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            if (loginModel is null)
            {
                return BadRequest("Invalid client request");
            }
            var user = _apContext.LoginModels.FirstOrDefault(u =>
                (u.UserName == loginModel.UserName) && (u.Password == loginModel.Password));
            if (user is null)
                return Unauthorized();
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, loginModel.UserName),
            new Claim(ClaimTypes.Role, "Manager")
        };
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            _apContext.SaveChanges();
            return Ok(new AuthenticatedResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken
            });
        }
    }
}
