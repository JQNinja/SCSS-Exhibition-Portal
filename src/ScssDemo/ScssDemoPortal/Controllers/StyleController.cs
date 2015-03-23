using LibSassNet;
using ScssDemoPortal.App_Start;
using System;
using System.Web;
using System.Web.Mvc;

namespace ScssDemoPortal.Controllers
{
    public class StyleController : Controller
    {
        [HttpPost]
        public ActionResult GetCss(string scss)
        {
            try
            {
                var scssDecoded = HttpUtility.UrlDecode(scss);
                var returnCss = ApplicationContainer.SassCompiler.Compile(scssDecoded, OutputStyle.Nested, false);
                var formattedCss = FormatCss(returnCss);
                return Json(new { success = true, css = formattedCss }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, css = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        private string FormatCss(string css)
        {
            return css.Replace("}", "\n}") + "\n\n";
        }
    }
}